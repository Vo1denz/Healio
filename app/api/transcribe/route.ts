import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SUPPORTED_FORMATS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];

const LANGUAGE_NAMES: { [key: string]: string } = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
  pl: 'Polish',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ar: 'Arabic',
  hi: 'Hindi',
};

const errorResponse = {
  error: 'Invalid file format. Supported formats are: ' + SUPPORTED_FORMATS.join(', '),
  supported_formats: SUPPORTED_FORMATS,
};

async function downloadFile(url: string, targetFile: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  
  const fileStream = fs.createWriteStream(targetFile);
  await finished(Readable.fromWeb(response.body as any).pipe(fileStream));
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  let filePath = '';
  
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Handle file upload
    if (file instanceof File) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
        return NextResponse.json(errorResponse, { status: 400 });
      }

      filePath = path.join(tempDir, `upload-${Date.now()}-${fileName}`);
      
      // If file is a URL, download it
      if (fileName.startsWith('http')) {
        await downloadFile(fileName, filePath);
      } else {
        // If file is an actual file, write it
        const bytes = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(bytes));
      }

      // Get file duration if possible
      let duration = 0;
      try {
        // You might want to implement actual duration detection here
        duration = 0;
      } catch (error) {
        console.error('Error getting file duration:', error);
      }

      console.log('Starting transcription...');

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        language: 'en', // Default to English
      });

      console.log('Transcription completed successfully');

      // Calculate word count
      const wordCount = transcription.text.split(/\s+/).filter(word => word.length > 0).length;

      // Since the OpenAI API no longer returns the detected language,
      // we'll default to English
      const languageName = LANGUAGE_NAMES['en'];

      // Clean up: delete the temporary file
      fs.unlinkSync(filePath);

      return NextResponse.json({
        text: transcription.text,
        language: languageName,
        languageCode: 'en',
        duration: duration,
        wordCount: wordCount,
        wordsPerMinute: duration > 0 ? Math.round((wordCount / duration) * 60) : 0,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid file format' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Transcription error:', error);
    // Clean up the file if it exists
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
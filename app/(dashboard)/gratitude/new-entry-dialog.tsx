"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Mic, StopCircle, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface NewEntryDialogProps {
  onSave: (entry: { gratitude: string }) => Promise<void>;
}

export function NewEntryDialog({ onSave }: NewEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [gratitude, setGratitude] = useState("");
  const [listening, setListening] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setListening(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        setListening(false);
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        await sendAudioToAPI(audioBlob);
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
    } catch (error) {
      toast.error("Microphone access denied or unavailable.");
      setListening(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  const sendAudioToAPI = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.mp3");

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setGratitude((prev) => prev + (prev ? " " : "") + data.text);
        toast.success("Transcription successful!");
      } else {
        toast.error("Transcription failed.");
      }
    } catch (error) {
      toast.error("Error connecting to transcription service.");
    }
  };

  const handleSave = async () => {
    if (!gratitude.trim()) {
      toast.error("Please enter or record your gratitude.");
      return;
    }
    await onSave({ gratitude });
    setGratitude("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#A7C4A0] hover:bg-[#96B38F] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">What Are You Grateful For Today?</DialogTitle>
          <DialogDescription>Speak or type your gratitude entry.</DialogDescription>
        </DialogHeader>
        <div className="relative mt-4">
          <Textarea
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="Type or speak here..."
            className="min-h-[200px] bg-[#f8fdf7] font-handwritten text-xl"
          />
          <Button
            className="absolute right-3 bottom-3 p-2 bg-[#A7C4A0] hover:bg-[#96B38F]"
            onClick={listening ? stopRecording : startRecording}
          >
            {listening ? <StopCircle className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5" />}
          </Button>
        </div>
        <Button className="w-full mt-4 bg-[#A7C4A0] hover:bg-[#96B38F] text-white" onClick={handleSave}>
          Save Entry
        </Button>
      </DialogContent>
    </Dialog>
  );
}
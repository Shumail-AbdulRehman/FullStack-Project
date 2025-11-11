import { Button } from '@/components/ui/button'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function UploadVideo() {
  return (
    <div>
        <div>
            <Button>Upload Video!</Button>
        </div>

      <div>
        <Dialog>
            <DialogTrigger>
                <button>Upload Video</button>
            </DialogTrigger>
            <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Video</DialogTitle>
                        <DialogDescription>
                            Select a video file to upload.
                        </DialogDescription>
                    </DialogHeader>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default UploadVideo

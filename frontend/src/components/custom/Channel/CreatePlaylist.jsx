import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function CreatePlaylist() {
  return (
      <div>
        <Dialog>
            <DialogTrigger>
                <button>Create Playlist</button>
            </DialogTrigger>
            <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Playlist</DialogTitle>
                        <DialogDescription>
                            
                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <Input
                        type="file"
                        accept="video/*"
                        ref

                        />
                    </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default CreatePlaylist

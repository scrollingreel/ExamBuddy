import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface NoteViewerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fileUrl: string;
}

export function NoteViewer({ isOpen, onClose, title, fileUrl }: NoteViewerProps) {
    const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-4">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                    <DialogTitle className="line-clamp-1 pr-8">{title}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden rounded-md relative group">
                    {/* Security overlay to prevent simple right-click save on images */}
                    {!isPdf && (
                        <div className="absolute inset-0 z-10 bg-transparent" onContextMenu={(e) => e.preventDefault()} />
                    )}

                    {isPdf ? (
                        <iframe
                            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full border-0"
                            title={title}
                        />
                    ) : (
                        <div className="w-full h-full overflow-auto flex items-center justify-center">
                            <img
                                src={fileUrl}
                                alt={title}
                                className="max-w-full max-h-full object-contain"
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

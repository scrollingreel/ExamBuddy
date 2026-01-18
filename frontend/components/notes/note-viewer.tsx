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
    isPremium?: boolean;
}

export function NoteViewer({ isOpen, onClose, title, fileUrl, isPremium }: NoteViewerProps) {
    const isPdf = fileUrl.toLowerCase().includes(".pdf");
    const isLocal = fileUrl.includes("localhost") || fileUrl.includes("127.0.0.1");

    // On mobile, native PDF viewing in iframe often fails (shows white).
    // accessible public URLs work best with Google Docs Viewer.
    const pdfViewerUrl = isPdf && !isLocal
        ? `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`
        : `${fileUrl}#toolbar=0`;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-4xl h-[80dvh] md:h-[85vh] flex flex-col p-4">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                    <DialogTitle className="line-clamp-1 pr-8 text-base">{title}</DialogTitle>
                    <div className="flex gap-2">
                        {/* Open Original button removed per user request */}
                    </div>
                </DialogHeader>
                <div className="flex-1 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden rounded-md relative group">
                    {/* Security overlay to prevent simple right-click save on images */}
                    {!isPdf && (
                        <div className="absolute inset-0 z-10 bg-transparent" onContextMenu={(e) => e.preventDefault()} />
                    )}

                    {/* Block Google Docs Viewer 'Pop-out' button for Premium Notes to prevent easy download */}
                    {isPdf && isPremium && (
                        <div className="absolute top-0 right-0 h-14 w-14 z-20 bg-transparent" />
                    )}

                    {isPdf ? (
                        <iframe
                            src={pdfViewerUrl}
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

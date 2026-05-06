import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, Share2 } from "lucide-react";

interface NoteViewerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fileUrl: string;
    isPremium?: boolean;
    shareUrl?: string;
}

export function NoteViewer({ isOpen, onClose, title, fileUrl, isPremium, shareUrl }: NoteViewerProps) {
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
                    <DialogDescription className="sr-only">Viewing note {title}</DialogDescription>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                            navigator.clipboard.writeText(shareUrl || fileUrl);
                            alert("Link copied to clipboard!");
                        }}>
                            <Share2 className="h-4 w-4 mr-2" /> Share
                        </Button>
                        <Button variant="default" size="sm" asChild>
                            <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" /> Download
                            </a>
                        </Button>
                    </div>
                </DialogHeader>
                <div className="flex-1 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden rounded-md relative group">

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
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

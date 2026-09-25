import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ProductAuthenticityCameraScanner } from "@/components/ProductAuthenticityCameraScanner";
import type { AiScanResult } from "@/lib/ai-scanner";

interface ProductScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyToPost?: (params: {
    brandName: string;
    brandOwner: string;
    productName: string;
    category: string;
    matchedBrandId?: string;
    file?: File | null;
    scanResult: AiScanResult;
  }) => void;
}

export function ProductScannerModal({
  open,
  onOpenChange,
  onApplyToPost,
}: ProductScannerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0 border-border/80 bg-card">
        {open && (
          <ProductAuthenticityCameraScanner
            onApplyToPost={onApplyToPost}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

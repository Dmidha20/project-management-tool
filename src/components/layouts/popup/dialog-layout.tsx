import { Button, Iconify } from '@app/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBlocker } from 'react-router-dom';



interface DynamicPopupLayoutProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  height?: string;
  borderHidden?: boolean;
  dialogClass?: string;
  contentClass?: string;
  description?: string;
}

const DialogLayout: React.FC<DynamicPopupLayoutProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-2xl',
  height = '',
  borderHidden = false,
  dialogClass = '',
  contentClass = '',
  description,
}) => {
  const blocker = useBlocker(({ historyAction }) => {
    return open && historyAction === 'POP';
  });

  useEffect(() => {
    if (blocker.state === 'blocked') {
      onClose();
      blocker.reset();
    }
  }, [blocker, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  const dialogContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--color-neutral-700)]/50 backdrop-brightness-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`bg-[var(--color-surface)] rounded-xl ${maxWidth} ${height} w-full relative shadow-lg max-h-[90vh] flex flex-col overflow-hidden ${dialogClass}`}
          >
            {title && (
              <div
                className={`flex items-center justify-between py-3 px-6 ${
                  borderHidden ? '' : 'border-b border-[var(--color-neutral-300)]'
                }`}
              >
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  {description && <p className="text-sm text-[var(--color-text-secondary)] mb-4 ">{description}</p>}
                </div>
                <Button
                  variant="clear"
                  onClick={onClose}
                  className="!p-1 bg-transparent hover:bg-[var(--color-surface-hover)] rounded-full"
                >
                  <Iconify icon="ic:outline-close" className="w-6 h-6 text-[var(--color-icon-primary)]" />
                </Button>
              </div>
            )}

            <div className={`flex-1 px-6 overflow-y-auto py-4 space-y-4 ${contentClass}`}>
              {children}
            </div>

            {footer && (
              <div
                className={`flex justify-end gap-3 py-4 px-6 ${
                  borderHidden ? '' : 'border-t border-[var(--color-neutral-300)]'
                }`}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') {
    return dialogContent;
  }

  return createPortal(dialogContent, document.body);
};

export { DialogLayout };

import { useState } from 'react';

interface SaveSlotInfo {
  slot: string;
  modified: string;
  size: number;
}

interface LoadGameModalProps {
  saves: SaveSlotInfo[];
  onLoad: (slot: string) => void;
  onClose: () => void;
  onDelete?: (slot: string) => Promise<void>;
}

export function LoadGameModal({
  saves,
  onLoad,
  onClose,
  onDelete
}: LoadGameModalProps) {
  const [deletingSlot, setDeletingSlot] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Sort saves by date (newest first)
  const sortedSaves = [...saves].sort((a, b) =>
    new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );

  const handleDelete = async (slot: string) => {
    if (!onDelete) return;

    if (confirmDelete === slot) {
      // Confirmed - delete it
      setDeletingSlot(slot);
      try {
        await onDelete(slot);
        setConfirmDelete(null);
      } catch (error) {
        console.error('Failed to delete save:', error);
        alert('Failed to delete save');
      } finally {
        setDeletingSlot(null);
      }
    } else {
      // First click - ask for confirmation
      setConfirmDelete(slot);
      // Reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getSlotIcon = (slot: string): string => {
    if (slot === 'autosave') return '🔄';
    if (slot.includes('quick')) return '⚡';
    if (slot.includes('backup')) return '💾';
    return '📁';
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Load Game</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Save Slots */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {sortedSaves.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-2">No saved games found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Start a new game and your progress will be saved automatically
              </p>
            </div>
          ) : (
            sortedSaves.map((save) => (
              <div
                key={save.slot}
                className={`
                  flex items-center justify-between p-4 rounded-lg
                  bg-gray-100 dark:bg-gray-700
                  hover:bg-gray-200 dark:hover:bg-gray-600
                  transition-[colors,opacity] duration-200
                  ${deletingSlot === save.slot ? 'opacity-50' : ''}
                `}
              >
                <button
                  onClick={() => onLoad(save.slot)}
                  disabled={deletingSlot === save.slot}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getSlotIcon(save.slot)}</span>
                    <div>
                      <div className="font-semibold">
                        {save.slot === 'autosave' ? 'Autosave' : save.slot}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(save.modified).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Size: {formatFileSize(save.size)}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Delete button */}
                {onDelete && save.slot !== 'autosave' && (
                  <button
                    onClick={() => handleDelete(save.slot)}
                    disabled={deletingSlot !== null}
                    className={`
                      ml-4 px-3 py-1 rounded text-sm
                      ${confirmDelete === save.slot
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-red-500 hover:text-white'
                      }
                      transition-colors duration-200
                      disabled:opacity-50
                    `}
                  >
                    {confirmDelete === save.slot ? 'Confirm?' : 'Delete'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

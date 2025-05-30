import { AnimatePresence, cubicBezier, motion } from 'framer-motion';

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onImagesSelected?: (images: File[]) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export const SendButton = ({ show, isStreaming, disabled, onClick }: SendButtonProps) => {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className="absolute flex justify-center items-center top-[20px] right-[20px] p-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl w-[40px] h-[40px] shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          transition={{ ease: customEasingFn, duration: 0.17 }}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          disabled={disabled}
          onClick={(event) => {
            event.preventDefault();

            if (!disabled) {
              onClick?.(event);
            }
          }}
        >
          <div className="text-lg">
            {!isStreaming ? <div className="i-ph:arrow-right"></div> : <div className="i-ph:stop-circle-bold"></div>}
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
};

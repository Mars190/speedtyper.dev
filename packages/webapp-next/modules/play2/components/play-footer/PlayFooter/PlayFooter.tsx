import { AnimatePresence, motion } from "framer-motion";
import { LinkIcon } from "../../../../../assets/icons/LinkIcon";
import { ReloadIcon } from "../../../../../assets/icons/ReloadIcon";
import Button from "../../../../../common/components/Button";
import { useIsPlaying } from "../../../../../common/hooks/useIsPlaying";
import { copyToClipboard } from "../../../../../common/utils/clipboard";
import { toHumanReadableTime } from "../../../../../common/utils/toHumanReadableTime";
import useTotalSeconds from "../../../../../hooks/useTotalSeconds";
import { Game } from "../../../services/Game";
import { useCodeStore } from "../../../state/code-store";
import { ChallengeSource } from "../ChallengeSource";

interface PlayFooterProps {
  game: Game;
}

function useCodeStoreTotalSeconds() {
  // TODO: move useTotalSeconds to modules folder
  const startTime = useCodeStore((state) => state.startTime);
  const endTime = useCodeStore((state) => state.endTime);
  const totalSeconds = useTotalSeconds(
    startTime?.getTime(),
    endTime?.getTime()
  );
  return totalSeconds;
}

export function PlayFooter({ game }: PlayFooterProps) {
  const isPlaying = useIsPlaying();
  const totalSeconds = useCodeStoreTotalSeconds();
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {!isPlaying && (
            <div className="flex row justify-between items-top">
              {RenderActionButtons(game)}
              <div className="text-faded-gray">
                <ChallengeSource
                  name="speedtyper.dev"
                  url="https://github.com/codicocodes/speedtyper.dev"
                  license="MIT"
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {isPlaying && RenderTimer(totalSeconds)}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function RenderActionButtons(game: Game) {
  return (
    <div className="relative">
      <div className="text-faded-gray">
        <Button
          color="invisible"
          title="Reload the challenge"
          size="sm"
          onClick={() => game.next()}
          leftIcon={<ReloadIcon />}
        />
        <Button
          color="invisible"
          title="Invite your friends to race"
          size="sm"
          onClick={() => {
            const url = new URL(window.location.href);
            if (game.id) {
              url.searchParams.set("id", game.id);
            }
            copyToClipboard(url.toString(), `${url} copied to clipboard`);
          }}
          leftIcon={<LinkIcon />}
        />
      </div>
    </div>
  );
}

function RenderTimer(seconds: number) {
  return (
    <div className="text-3xl ml-4 font-bold text-purple-300">
      {toHumanReadableTime(seconds)}
    </div>
  );
}

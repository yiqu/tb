import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { BorderBeam } from '@/components/magicui/border-beam';
import ScrambleHover from '@/fancy/components/text/scramble-hover';

export default async function KeyboardShortcutsDisplay() {
  return (
    <DisplayCard className="relative w-full overflow-hidden p-4">
      <section className="flex flex-row items-center justify-between">
        <Typography variant="body0" className="font-semibold">
          <ScrambleHover
            text={ 'Keyboard Shortcuts' }
            scrambleSpeed={ 50 }
            maxIterations={ 8 }
            useOriginalCharsOnly={ true }
            className=""
          />
        </Typography>
      </section>
      <section className={ `flex w-full flex-col items-start justify-start gap-y-4` }>
        <KeyboardShortCuts />
      </section>
      <BorderBeam duration={ 10 } size={ 400 } className="from-transparent via-[#53ff1a] to-transparent" />
      <BorderBeam duration={ 10 } delay={ 3 } size={ 400 } className="from-transparent via-[#6600ff] to-transparent" />
    </DisplayCard>
  );
}

function KeyboardShortCuts() {
  return (
    <>
      <div className="grid w-full grid-cols-2 gap-x-2">
        <Typography variant="body0" className="truncate">
          Quick Search
        </Typography>
        <Typography variant="body0" className="text-end font-mono">
          <kbd className="rounded-xl border-1 bg-background px-2 py-1">/</kbd>
        </Typography>
      </div>
      <div className="grid w-full grid-cols-2 gap-x-2">
        <Typography variant="body0" className="truncate">
          Add New Bill
        </Typography>
        <Typography variant="body0" className="text-end font-mono">
          <kbd className="rounded-xl border-1 bg-background px-2 py-1">Ctrl</kbd> +{ ' ' }
          <kbd className="rounded-xl border-1 bg-background px-2 py-1">A</kbd>
        </Typography>
      </div>
      <div className="grid w-full grid-cols-2 gap-x-2">
        <Typography variant="body0" className="wrap-normal">
          Add New Subscription
        </Typography>
        <Typography variant="body0" className="text-end font-mono">
          <kbd className="rounded-xl border-1 bg-background px-2 py-1">Ctrl</kbd> +{ ' ' }
          <kbd className="rounded-xl border-1 bg-background px-2 py-1">B</kbd>
        </Typography>
      </div>
    </>
  );
}

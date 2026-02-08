import Button from '@mui/material/Button';

import { SunMoon } from 'lucide-react';

import Typography from '@/components/typography/Typography';
import { CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import DisplayCard from '../@content/personal-info/_components/DisplayCard';
import AccountGeneralColorModeSelectionContent from './AccountGeneralColorModeSelectionContent';

export default function AccountGeneralModeSelection() {
  return (
    <DisplayCard>
      <CardHeader>
        <CardTitle>
          <Typography variant="h5" className="flex items-center gap-x-2">
            <SunMoon className="size-6" />
            Color Mode
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="body1">Pick a color mode.</Typography>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <AccountGeneralColorModeSelectionContent />
        <Button variant="contained" color="primary" sx={ { width: '20rem' } } size="small">
          MUI Button Preview
        </Button>
      </CardContent>
    </DisplayCard>
  );
}

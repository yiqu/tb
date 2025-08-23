/* eslint-disable no-unused-vars */
import { appName } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { AuroraText } from '@/components/magicui/aurora-text';
import Aurora from '@/components/reactbits/Backgrounds/Aurora/Aurora';
import NavHeaderLogo from '@/components/side-nav/header/NavHeaderLogo';

import ConsentContentCard from './ConsentContentCard';

const CASE_MATE = ['#84754e', '#a6192e', '#decba5', '#000000'];
const ADOBE = ['#ff0000', '#fbb034', '#ffdd00', '#c1d82f', '#00a4e4', '#8a7967', '#6a737b'];
const WEST_D = ['#005195', '#028948', '#ffd400', '#0067b3', '#9d0a0e', '#003369'];
const MS = ['#f05125', '#fdb813', '#7fbb42', '#32a0da'];
const PHP = ['#8892be', '#4f5b93', '#99cc99'];
const RTG = ['#d73027', '#fc8d59', '#fee08b', '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'];
const OTP = ['#e66101', '#fdb863', '#5e3c99', '#f7f7f7'];
const GOOG = ['#4285f4', '#34a853', '#fbbc05', '#ea4335'];

export default function ConsentDisplay() {
  return (
    <div className="fixed inset-0 flex h-full w-full flex-col items-center justify-center">
      <Aurora colorStops={ GOOG } blend={ 0.5 } amplitude={ 1.0 } speed={ 0.5 } />
      <div className="fixed">
        <div className="flex flex-row items-center justify-start gap-x-2">
          <NavHeaderLogo size={ 50 } />
          <Typography variant="h3" className="font-fun text-3xl tracking-widest text-border">
            <AuroraText colors={ WEST_D }>{ appName }</AuroraText>
          </Typography>
        </div>
        <ConsentContentCard />
      </div>
    </div>
  );
}

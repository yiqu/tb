import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { BorderBeam } from '@/components/magicui/border-beam';
import CenterUnderline from '@/fancy/components/text/underline-center';
import { CardTitle, CardHeader, CardContent } from '@/components/ui/card';

export default function PageInfoPage() {
  return (
    <div className="flex flex-col items-center justify-start">
      <DisplayCard className="w-[30rem] overflow-hidden relative">
        <CardHeader>
          <CardTitle>Page Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start justify-start">
            <table className="w-full border-separate border-spacing-y-2">
              <tbody>
                <tr>
                  <td className="w-[30%]">
                    <Typography>Contact:</Typography>
                  </td>
                  <td className="w-[70%]">
                    <Typography>KQ</Typography>
                  </td>
                </tr>
                <tr>
                  <td className="w-[30%]">
                    <Typography>Email:</Typography>
                  </td>
                  <td className="w-[70%]">
                    <Typography>
                      <a href="mailto:kq@kq.com">
                        <CenterUnderline label="kq@kq.com" />
                      </a>
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
        <BorderBeam duration={ 8 } size={ 120 } />
      </DisplayCard>
    </div>
  );
}

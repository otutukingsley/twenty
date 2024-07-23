import { ConnectedAccount } from '@/accounts/types/ConnectedAccount';
import { currentUserState } from '@/auth/states/currentUserState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useTriggerGoogleApisOAuth } from '@/settings/accounts/hooks/useTriggerGoogleApisOAuth';
import { Button } from '@/ui/input/button/components/Button';
import { useRecoilValue } from 'recoil';
import { Banner, IconRefresh } from 'twenty-ui';

export enum ConnectedAccountKeys {
  ACCOUNTS_TO_RECONNECT = 'ACCOUNTS_TO_RECONNECT',
}

export const InformationBanner = () => {
  const currentUser = useRecoilValue(currentUserState);

  const userVars = currentUser?.userVars;

  const accountIdsToReconnect =
    userVars?.[ConnectedAccountKeys.ACCOUNTS_TO_RECONNECT] ?? [];

  const accountToReconnect = useFindOneRecord<ConnectedAccount>({
    objectNameSingular: CoreObjectNameSingular.ConnectedAccount,
    objectRecordId: accountIdsToReconnect[0],
  });

  const { triggerGoogleApisOAuth } = useTriggerGoogleApisOAuth();

  if (!accountToReconnect?.record) {
    return null;
  }

  return (
    <Banner>
      Sync lost with mailbox {accountToReconnect?.record?.handle}. Please
      reconnect for updates:
      <Button
        variant="secondary"
        title="Reconnect"
        Icon={IconRefresh}
        size="small"
        inverted
        onClick={() => triggerGoogleApisOAuth()}
      />
    </Banner>
  );
};

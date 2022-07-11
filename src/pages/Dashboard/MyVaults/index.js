import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { PageTitleTypo } from '../style';
import VaultItem from '../../../components/VaultItem';
import { emptyVaultItem } from '../../../utils/filler';
import useUser from '../../../hooks/useUser';
import { createVault, getHiveVaultInfo } from '../../../service/fetch';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  height: '50px',
  width: 'fit-content',
  color: '#FF931E',
  border: '1px solid #FF931E',
  borderRadius: '200px',
  fontWeight: 600,
  lineHeight: '18px',
  fontSize: '15px',
  padding: '15px 11px',
  [theme.breakpoints.up('md')]: {
    height: '70px',
    lineHeight: '24px',
    fontSize: '20px',
    padding: '23px 17px',
    border: '2px solid #FF931E'
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#fff'
  }
}));

const PlusTypo = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  lineHeight: '37px',
  fontSize: '30px',
  marginRight: '5px',
  [theme.breakpoints.up('md')]: {
    lineHeight: '43px',
    fontSize: '35px'
  }
}));

export default function HiveVaults() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [myVaultsList, setMyVaultsList] = useState(Array(1).fill(emptyVaultItem));

  useEffect(async () => {
    setLoading(true);
    const vaultItem = await getHiveVaultInfo(user.did, undefined, 1);
    if (vaultItem) setMyVaultsList([vaultItem]);
    else setMyVaultsList([]);
    setLoading(false);
  }, []);

  const handleCreateVault = () => {
    createVault(user.did)
      .then((res) => {
        if (res)
          enqueueSnackbar('Create vault succeed', {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
        else
          enqueueSnackbar('Vault already exists', {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' }
          });
      })
      .catch((e) => {
        enqueueSnackbar('Create vault error', {
          variant: 'error',
          anchorOrigin: { horizontal: 'right', vertical: 'top' }
        });
      });
  };

  return (
    <>
      <PageTitleTypo mt={{ xs: 7, md: 15 }} mb={myVaultsList.length ? 0 : 1.25}>
        My Vaults
      </PageTitleTypo>
      <Stack mt={{ xs: 1.75, md: 5 }} mb={6.25} spacing={{ xs: 3.75, md: 6.25 }}>
        {myVaultsList.map((item, index) => (
          <VaultItem
            key={index}
            // id={item.id}
            name={item.name}
            total={item.total}
            used={item.used}
            time={item.time}
            ownerName={item.ownerName}
            isMyVault
            isLoading={loading}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3.125, md: 5 }}>
        <CustomButton onClick={handleCreateVault} disabled={myVaultsList.length > 0}>
          <PlusTypo>+</PlusTypo>
          Create Hive Vault
        </CustomButton>
        <CustomButton onClick={() => {}}>Access Hive Vaults</CustomButton>
      </Stack>
    </>
  );
}

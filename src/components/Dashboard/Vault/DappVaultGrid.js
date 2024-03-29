import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack, LinearProgress, Skeleton, Typography, Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LabelTypo, NormalTypo } from '../../Custom/CustomTypos';
import { dedicatedDappList, reduceHexAddress } from '../../../service/common';
import { fetchHiveScriptPictureToDataUrl } from '../../../service/fetch';
import { useUserContext } from '../../../contexts/UserContext';

DappVaultGrid.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  appDid: PropTypes.string,
  used: PropTypes.number,
  total: PropTypes.number,
  isLoading: PropTypes.bool,
  innerSx: PropTypes.object
};

export default function DappVaultGrid({
  avatar,
  name,
  appDid,
  used,
  total,
  isLoading,
  innerSx = {}
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [appName, setAppName] = useState(name || '');
  const [appAvatar, setAppAvatar] = useState(avatar || '');

  useEffect(() => {
    const fetch = async () => {
      if (!name || !avatar) {
        const id = dedicatedDappList.findIndex((el) => el.appDid === appDid);
        const dappId = id < 0 ? 0 : id;
        setAppName(
          dappId === 0 && appDid ? reduceHexAddress(appDid, 10) : dedicatedDappList[dappId].name
        );
        setAppAvatar(dedicatedDappList[dappId].avatar);
      } else if (avatar) {
        const avatarUrl = await fetchHiveScriptPictureToDataUrl(avatar, user.did);
        setAppAvatar(avatarUrl);
        setAppName(name);
      }
    };
    if (user.did) fetch();
  }, [appDid, avatar, name, user.did]);

  const handleImageError = (e) => {
    e.target.src = '/static/dapp/ic_unknown.svg';
    setAppAvatar(e.target.src);
  };

  return (
    <Grid item lg={6} md={6} sm={12} xs={12}>
      {isLoading ? (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 147, 30, 0.05)',
            borderRadius: '20px',
            width: '100%',
            padding: { xs: '10px 10px 10px 20px', sm: '20px 20px 20px 40px' },
            position: 'relative',
            ...innerSx
          }}
        >
          <Typography component="div" variant="h4" width="30%">
            <Skeleton animation="wave" />
          </Typography>
          <Typography component="div" variant="h6" width="30%" sx={{ mb: 3 }}>
            <Skeleton animation="wave" />
          </Typography>
          <Typography component="div" variant="h6">
            <Skeleton animation="wave" />
          </Typography>
        </Box>
      ) : (
        <Box
          onClick={() => {
            if (appDid) navigate(`/dashboard/vault/dapp/${appDid}`);
          }}
          sx={{
            backgroundColor: 'rgba(255, 147, 30, 0.05)',
            borderRadius: '20px',
            width: '100%',
            padding: { xs: '10px 10px 10px 20px', sm: '20px 20px 20px 40px' },
            position: 'relative',
            cursor: 'pointer',
            ...innerSx
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              component="img"
              src={appAvatar}
              alt=""
              width="30px"
              onError={handleImageError}
              sx={{ borderRadius: '5px' }}
            />
            <NormalTypo sx={{ fontWeight: 600, color: '#FFF' }} noWrap>
              {appName || reduceHexAddress(appDid, 6)}
            </NormalTypo>
          </Stack>
          <LabelTypo my={2}>
            {used} MB {t('vault-used')}
          </LabelTypo>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'end', sm: 'center' }}
            spacing={{ xs: 2, sm: 5 }}
          >
            <LinearProgress
              variant="determinate"
              value={(used / total ?? 0) * 100}
              color="warning"
              sx={{
                height: '10px',
                borderRadius: '100px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />
          </Stack>
        </Box>
      )}
    </Grid>
  );
}

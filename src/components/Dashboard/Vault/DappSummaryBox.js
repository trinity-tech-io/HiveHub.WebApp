import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Stack, LinearProgress, Skeleton, Typography, Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { LabelTypo, PageTitleTypo, NormalTypo } from '../../Custom/CustomTypos';
import { dedicatedDappList, reduceHexAddress } from '../../../service/common';
import { fetchHiveScriptPictureToDataUrl } from '../../../service/fetch';
import { useUserContext } from '../../../contexts/UserContext';

DappSummaryBox.propTypes = {
  avatar: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  appDid: PropTypes.string,
  used: PropTypes.number,
  redirect: PropTypes.string,
  total: PropTypes.number,
  isLoading: PropTypes.bool,
  innerSx: PropTypes.object
};

export default function DappSummaryBox({
  avatar,
  name,
  description,
  appDid,
  used,
  redirect,
  total,
  isLoading = false,
  innerSx = {}
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [appName, setAppName] = useState(name || '');
  const [appAvatar, setAppAvatar] = useState(avatar || '');
  const theme = useTheme();
  const matchMdUp = useMediaQuery(theme.breakpoints.up('md'));

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
            padding: { xs: '10px', sm: '20px 40px' },
            position: 'relative',
            ...innerSx
          }}
        >
          <Stack direction="row" spacing={{ xs: 3, md: 6 }} alignItems="left">
            <Box sx={{ display: 'flex', width: '200px' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: '50px', md: '100px' },
                  height: { xs: '50px', md: '100px' },
                  mx: { xs: 1.5, md: 4 },
                  my: 'auto',
                  borderRadius: '200px'
                }}
              >
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={matchMdUp ? 100 : 50}
                  height={matchMdUp ? 100 : 50}
                />
              </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography component="div" variant="h4" width="30%">
                <Skeleton animation="wave" />
              </Typography>
              <Typography component="div" variant="h6" width="30%" sx={{ mb: 3 }}>
                <Skeleton animation="wave" />
              </Typography>
              <Typography component="div" variant="h6" width="30%" sx={{ mb: 1 }}>
                <Skeleton animation="wave" />
              </Typography>
              <Typography component="div" variant="h6">
                <Skeleton animation="wave" />
              </Typography>
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box
          onClick={() => {
            if (redirect) navigate(redirect);
          }}
          sx={{
            backgroundColor: 'rgba(255, 147, 30, 0.05)',
            borderRadius: '20px',
            width: '100%',
            padding: { xs: '10px', sm: '20px 40px' },
            position: 'relative',
            cursor: redirect ? 'pointer' : 'auto',
            ...innerSx
          }}
        >
          <Stack direction="row" spacing={{ xs: 4, md: 8 }} alignItems="left">
            <Box sx={{ display: 'flex' }}>
              <Box
                component="img"
                src={appAvatar}
                alt=""
                onError={handleImageError}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: '50px', md: '100px' },
                  height: { xs: '50px', md: '100px' },
                  mx: { xs: 1.5, md: 4 },
                  my: 'auto',
                  borderRadius: '200px'
                }}
              />
              {/* <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: '50px', md: '100px' },
                  height: { xs: '50px', md: '100px' },
                  mx: { xs: 1.5, md: 4 },
                  my: 'auto',
                  background: '#000',
                  borderRadius: '200px'
                }}
              >
                <Box
                  component="img"
                  src={appAvatar}
                  alt=""
                  sx={{
                    width: { xs: '35px', md: '70px' },
                    height: { xs: '35px', md: '70px' },
                    transition: 'border-radius .2s',
                  }}
                />
              </Box> */}
            </Box>
            <Box sx={{ width: '100%' }}>
              <PageTitleTypo sub="true" noWrap>
                {appName || reduceHexAddress(appDid, 6)}
              </PageTitleTypo>
              {description && (
                <NormalTypo noWrap sx={{ color: '#B3B3B3' }}>
                  {description}
                </NormalTypo>
              )}
              <LabelTypo mt={4} mb={1}>
                {used} MB {t('vault-used')}
              </LabelTypo>
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
            </Box>
          </Stack>
        </Box>
      )}
    </Grid>
  );
}

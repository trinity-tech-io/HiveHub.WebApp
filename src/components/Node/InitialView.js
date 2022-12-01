import PropTypes from 'prop-types';
import { Box, Typography, Stack } from '@mui/material';
import SmallHexagon from '../SmallHexagon';
import { PlusButton } from '../Custom/CustomButtons';
import { FeatureGrid } from '../Custom/CustomContainer';
import { HeaderTypo, LabelTypo } from '../Custom/CustomTypos';

NodeInitialView.propTypes = {
  onClickEnvConfig: PropTypes.func,
  onClickCreateNode: PropTypes.func,
  sx: PropTypes.object
};

export default function NodeInitialView({ onClickEnvConfig, onClickCreateNode, sx = {} }) {
  return (
    <Box sx={{ ...sx }}>
      <FeatureGrid>
        <Box sx={{ margin: '20px 0 20px' }}>
          <SmallHexagon
            borderColor="#FF931E"
            rootHexagon
            sideLength={30}
            borderWidth={2}
            backColor="transparent"
          >
            <Typography variant="h3" sx={{ color: '#FFC98F', height: '30px', lineHeight: '32px' }}>
              +
            </Typography>
            <Box
              sx={{
                transform: 'rotate(300deg)',
                position: 'absolute',
                top: '-23px',
                left: '-22px'
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#FFC98F'
                }}
              />
              <Box
                sx={{
                  width: '2px',
                  height: '16px',
                  backgroundColor: '#FFC98F',
                  marginLeft: '7px'
                }}
              />
            </Box>
            <Box
              sx={{
                transform: 'rotate(120deg)',
                position: 'absolute',
                top: '21px',
                left: '53px'
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#FFC98F'
                }}
              />
              <Box
                sx={{
                  width: '2px',
                  height: '16px',
                  backgroundColor: '#FFC98F',
                  marginLeft: '7px'
                }}
              />
            </Box>
          </SmallHexagon>
        </Box>
        <HeaderTypo sx={{ py: 1 }}>Become your own node operator now!</HeaderTypo>
        <LabelTypo sx={{ py: 1 }}>Create and deploy your own Hive node!</LabelTypo>
      </FeatureGrid>
      <Stack mt={{ xs: 4, md: 6 }} spacing={{ xs: 3.5, md: 5 }} sx={{ alignItems: 'center' }}>
        <PlusButton hasPlus={false} onClick={onClickEnvConfig}>
          Configure .env file
        </PlusButton>
        <PlusButton hasPlus={false} onClick={onClickCreateNode}>
          Register Node
        </PlusButton>
      </Stack>
    </Box>
  );
}

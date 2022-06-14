import { Stack, Box, Typography, Chip, Button, LinearProgress } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { MHidden } from './@material-extend';
import ItemBox from './ItemBox';

const VaultTitle = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '24px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '30px',
    lineHeight: '36px'
  }
}));

const VaultValue = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontWeight: 400,
  fontSize: '8px',
  lineHeight: '10px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '16px',
    lineHeight: '20px'
  }
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF931E',
  height: '25px',
  padding: '6px 14px',
  borderRadius: '200px',
  boxSizing: 'border-box',
  color: '#FFF',
  fontSize: '10px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(255, 147, 30, 0.3)',
    color: '#fff'
  },
  [theme.breakpoints.up('sm')]: {
    height: '45px',
    fontSize: '15px',
    padding: '13px 29px'
  }
}));

VaultItem.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  used: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
  showButton: PropTypes.bool
};

export default function VaultItem({ id, name, total, used, time, showButton = false }) {
  return (
    <ItemBox time={time}>
      <Stack spacing={{ xs: '10px', sm: '20px' }} pt={{ xs: '10px', sm: '5px' }}>
        <VaultTitle>{`${name}'s Vault`}</VaultTitle>
        <VaultValue>{`${used} MB / ${total} MB`}</VaultValue>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'end', sm: 'center' }}
          spacing={{ xs: 2, sm: 5 }}
        >
          <LinearProgress
            variant="determinate"
            value={(used / total) * 100}
            color="warning"
            sx={{ height: '10px', borderRadius: '100px', width: '100%' }}
          />
          {showButton && <CustomButton>Access</CustomButton>}
        </Stack>
      </Stack>
    </ItemBox>
  );
}
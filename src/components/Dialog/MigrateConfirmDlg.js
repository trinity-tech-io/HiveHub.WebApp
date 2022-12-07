import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { HeaderTypo, NormalTypo } from '../Custom/CustomTypos';
import { ConfirmButton } from '../Custom/CustomButtons';

MigrateConfirmDlg.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default function MigrateConfirmDlg({ open, onClose, onClick, disabled }) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      aria-labelledby="migrate-dialog-title"
      aria-describedby="migrate-dialog-description"
      PaperProps={{
        sx: {
          background: '#161C24',
          borderRadius: '40px',
          px: 1,
          py: 2
        }
      }}
      TransitionProps={{
        sx: {
          background: 'rgba(22, 28, 36, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0px'
        }
      }}
    >
      <DialogTitle id="migrate-dialog-title">
        <HeaderTypo sx={{ py: 1, textAlign: 'center' }}>{t('btn-migrate')}</HeaderTypo>
      </DialogTitle>
      <DialogContent>
        <img
          src="/static/ic_migrate.svg"
          alt="migrate_icon"
          width="60px"
          style={{ margin: '20px auto 30px auto' }}
        />
        <DialogContentText id="migrate-dialog-description">
          <NormalTypo component="span" sx={{ py: 1, px: { xs: 1, md: 2 }, textAlign: 'center' }}>
            {t('dlg-migrate-confirm-label')}
          </NormalTypo>
        </DialogContentText>
        <Stack
          direction="row"
          mt={{ xs: 5, md: 7.5 }}
          spacing={{ xs: 1.5, md: 3 }}
          justifyContent="center"
        >
          <ConfirmButton
            onClick={onClose}
            sx={{
              color: '#FF931E',
              background: 'transparent',
              border: { xs: '1px solid #FF931E', md: '2px solid #FF931E' },
              width: { xs: '120px', md: '240px' }
            }}
          >
            {t('btn-cancel')}
          </ConfirmButton>
          <ConfirmButton
            onClick={onClick}
            sx={{ width: { xs: '120px', md: '240px' } }}
            disabled={disabled}
          >
            {t('btn-migrate')}
          </ConfirmButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

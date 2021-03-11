import React from 'react';
import {
  Modal,
  VisualPicker,
  VisualPickerOption,
  VisualPickerOptionFooter,
} from 'react-rainbow-components';
import TelaHance2 from 'assets/TelaHance2.svg';
import Clipboard from 'assets/clipboard.svg';
import Schedule from 'assets/consult.svg';
import Files from 'assets/files.svg';
import classes from './EndModal.module.css';
import { useHistory } from 'react-router';

enum Labels {
  Appointments = 'appointments',
  Consult = 'consult',
  Consults = 'consults',
}

export default function EndModal({
  consultId,
  isOpen,
  onClose,
}: EndModalProps) {
  const history = useHistory();

  function navigate(value: string | string[]) {
    switch (value) {
      case Labels.Appointments:
        history.push('/appointments');
        break;
      case Labels.Consult:
        history.push(`/consults/${consultId}`);
        break;
      case Labels.Consults:
        history.push(`/consults`);
        break;
    }
  }

  return (
    <Modal
      title={<img src={TelaHance2} className={classes.title} alt='TelaHance Logo'/>}
      size='medium'
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className={classes.content}>
        <VisualPicker onChange={navigate}>
          <VisualPickerOption
            name={Labels.Appointments}
            footer={
              <VisualPickerOptionFooter
                label={<h5>Appointments</h5>}
                description='View and start upcoming appointments.'
              />
            }
          >
            <img src={Schedule} alt='Appointments Page'/>
          </VisualPickerOption>
          <VisualPickerOption
            name={Labels.Consult}
            footer={
              <VisualPickerOptionFooter
                label={<h5>Review Consult</h5>}
                description='Review, edit, and listen back to this consult.'
              />
            }
          >
            <img src={Clipboard} alt='Review Current Consult'/>
          </VisualPickerOption>
          <VisualPickerOption
            name={Labels.Consults}
            footer={
              <VisualPickerOptionFooter
                label={<h5>Prior Consults</h5>}
                description='Review your previous consults at a glance.'
              />
            }
          >
            <img src={Files} alt='Consults Page'/>
          </VisualPickerOption>
        </VisualPicker>
      </div>
    </Modal>
  );
}

type EndModalProps = {
  consultId: string;
  isOpen: boolean;
  onClose: () => void;
};

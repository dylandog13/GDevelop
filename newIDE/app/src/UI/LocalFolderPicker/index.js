// @flow
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { type I18n as I18nType } from '@lingui/core';

import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import optionalRequire from '../../Utils/OptionalRequire.js';
const electron = optionalRequire('electron');
const dialog = electron ? electron.remote.dialog : null;

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'baseline',
  },
  button: {
    marginLeft: 10,
  },
  textField: {
    flex: 1,
  },
};

type Props = {|
  type: 'export' | 'create-game',
  value: string,
  onChange: string => void,
  defaultPath?: string,
  fullWidth?: boolean,
  floatingLabelText?: string,
|};

type TitleAndMessage = {|
  title: ?string,
  message: ?string,
|};

export default class LocalFolderPicker extends PureComponent<Props, {||}> {
  _onChooseFolder = ({ title, message }: TitleAndMessage) => {
    if (!dialog || !electron) return;

    const browserWindow = electron.remote.getCurrentWindow();
    dialog.showOpenDialog(
      browserWindow,
      {
        title,
        properties: ['openDirectory', 'createDirectory'],
        message,
        defaultPath: this.props.defaultPath,
      },
      paths => {
        if (!paths || !paths.length) return;

        this.props.onChange(paths[0]);
      }
    );
  };

  _getTitleAndMessage = (i18n: I18nType): TitleAndMessage => {
    const { type } = this.props;
    if (type === 'export') {
      return {
        title: i18n._(t`Choose an export folder`),
        message: i18n._(t`Choose where to export the game`),
      };
    } else if (type === 'create-game') {
      return {
        title: i18n._(t`Choose a folder for the new game`),
        message: i18n._(t`Choose where to create the game`),
      };
    }

    return {
      title: undefined,
      message: undefined,
    };
  };

  render() {
    return (
      <I18n>
        {({ i18n }) => (
          <div
            style={{
              ...styles.container,
              width: this.props.fullWidth ? '100%' : undefined,
            }}
          >
            <TextField
              style={styles.textField}
              floatingLabelText={this.props.floatingLabelText}
              floatingLabelFixed
              type="text"
              hintText={<Trans>Click to choose</Trans>}
              value={this.props.value}
              onChange={(event, value) => this.props.onChange(value)}
            />
            <FlatButton
              label={<Trans>Choose folder</Trans>}
              style={styles.button}
              onClick={() =>
                this._onChooseFolder(this._getTitleAndMessage(i18n))
              }
            />
          </div>
        )}
      </I18n>
    );
  }
}

import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import * as copy from 'copy-to-clipboard';
import * as React from 'react';
import { HitDatabaseEntry } from 'types';
import { showPlainToast } from 'utils/toaster';

interface Props {
  readonly hit: HitDatabaseEntry;
}

class HitDbEntryMenu extends React.PureComponent<Props, never> {
  private static handleCopy = (copyText: string, toastText: string) => () => {
    copy(copyText);
    showPlainToast(toastText);
  };

  public render() {
    const { hit } = this.props;
    return (
      <Menu>
        <MenuDivider title="Copy..." />
        <MenuItem
          icon="duplicate"
          onClick={HitDbEntryMenu.handleCopy(
            hit.title,
            `"${hit.title}" copied to clipboard.`
          )}
          text="HIT title"
        />
        <MenuItem
          icon="duplicate"
          onClick={HitDbEntryMenu.handleCopy(
            hit.id,
            `"${hit.id}" copied to clipboard.`
          )}
          text="HIT ID"
        />
        <MenuItem
          icon="duplicate"
          onClick={HitDbEntryMenu.handleCopy(
            hit.requester.name,
            `"${hit.requester.name}" copied to clipboard.`
          )}
          text="Requester name"
        />
        <MenuItem
          icon="duplicate"
          onClick={HitDbEntryMenu.handleCopy(
            hit.requester.id,
            `Requester ID copied to clipboard.`
          )}
          text="Requester ID"
        />
      </Menu>
    );
  }
}

export default HitDbEntryMenu;
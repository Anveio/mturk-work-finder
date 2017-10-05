import * as React from 'react';
import { connect } from 'react-redux';
import { Card } from '@shopify/polaris';
import { RootState } from '../../types';
import CompletedHitList from './CompletedHitList';
import DateDisplay from './DateDisplay';
import InfoHeader from './InfoHeader';
// import ActionButtons from './ActionButtons';

export interface Props {
  readonly dateIsSelected: boolean;
}

class SelectedHitDate extends React.PureComponent<Props, never> {
  public render() {
    return this.props.dateIsSelected ? (
      <Card>
        <DateDisplay />
        {/* <ActionButtons /> */}
        <InfoHeader />
        <CompletedHitList />
      </Card>
    ) : (
      <Card>
        <DateDisplay />
      </Card>
    );
  }
}

const mapState = (state: RootState): Props => ({
  dateIsSelected: !!state.selectedHitDbDate
});

export default connect(mapState)(SelectedHitDate);
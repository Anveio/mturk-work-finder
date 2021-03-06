import * as React from 'react';
import { connect } from 'react-redux';
import {
  Tooltip,
  Button,
  Position,
  Collapse,
  AnchorButton
} from '@blueprintjs/core';
import { Stack, Caption } from '@shopify/polaris';
import { RootState } from 'types';
import { statusSummaryRequest } from 'actions/statusSummary';
import { statusDetailRequest } from 'actions/statusDetail';
import { MINIMAL_BUTTON_GROUP } from 'constants/blueprint';

export interface Props {
  readonly waitingForHitDbRefresh: boolean;
}

export interface Handlers {
  readonly onRefreshDb: () => void;
  readonly onRefreshDate: (
    date: Date,
    page: number,
    withToast: boolean
  ) => void;
}

export interface State {
  readonly hovering: boolean;
}

class CalendarButtons extends React.PureComponent<Props & Handlers, State> {
  readonly state: State = { hovering: false };

  private static tooltipContent = `This will scan all HITs submitted in the last 45 days.`;
  private static captionContent = `Refreshing your entire database more than once a minute may 
  temporarily prevent you from using MTurk for a few moments (at no other 
  penalty to your account). It's recommended you refresh your entire database 
  no more than once a minute and refresh just today's HITs as needed.`;

  private handleMouseEnter = () => {
    this.setState({ hovering: true });
  };

  private handleMouseLeave = () => {
    this.setState({ hovering: false });
  };

  public render() {
    const { tooltipContent, captionContent } = CalendarButtons;
    return (
      <Stack vertical>
        <div className={MINIMAL_BUTTON_GROUP}>
          <Tooltip
            content={tooltipContent}
            position={Position.TOP_LEFT}
            isOpen={this.state.hovering}
          >
            <AnchorButton
              loading={this.props.waitingForHitDbRefresh}
              icon="database"
              onClick={this.props.onRefreshDb}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            >
              Refresh Database
            </AnchorButton>
          </Tooltip>
          <Button
            icon="refresh"
            onClick={() => {
              this.props.onRefreshDate(new Date(), 1, true);
            }}
          >
            Refresh {new Date().toLocaleDateString()} (Today)
          </Button>
        </div>
        <Collapse isOpen={this.state.hovering}>
          <Caption>{captionContent}</Caption>
        </Collapse>
      </Stack>
    );
  }
}

const mapState = (state: RootState): Props => ({
  waitingForHitDbRefresh: state.waitingForHitDbRefresh
});

const mapDispatch: Handlers = {
  onRefreshDate: statusDetailRequest,
  onRefreshDb: statusSummaryRequest
};

export default connect(
  mapState,
  mapDispatch
)(CalendarButtons);

import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RootState, BlockedHit } from '../../types';
import { Card, Stack, Heading, Button, ResourceList } from '@shopify/polaris';
import { Popover, Position } from '@blueprintjs/core';
import BlockedHitCard from './BlockedHitCard';
import {
  recentlyBlockedHits,
  blockedHitsInLast,
  blockedHitsOlderThan
} from 'selectors/blocklists';
import SweepMenu from './SweepMenu';
import { Set, List } from 'immutable';
import {
  UnblockHit,
  unblockMultipleHits,
  blockMultipleHits
} from 'actions/blockHit';
import { Duration } from 'constants/enums';

interface Props {
  readonly blockedHits: {
    // recent needs to be displayed in order and Sets dont have a defined iteration order.
    readonly recent: List<BlockedHit>;
    readonly entries: {
      readonly inThePast: {
        readonly hour: Set<BlockedHit>;
        readonly day: Set<BlockedHit>;
        readonly week: Set<BlockedHit>;
      };
      readonly olderThan: {
        readonly thirtyDays: Set<BlockedHit>;
        readonly sixtyDays: Set<BlockedHit>;
        readonly ninetyDays: Set<BlockedHit>;
      };
    };
  };
  readonly blocklistSize: number;
}

interface Handlers {
  readonly massUnblock: (ids: Set<string>) => void;
  readonly undoMassUnblock: (requesters: Set<BlockedHit>) => void;
}

class HitBlockList extends React.PureComponent<Props & Handlers, never> {
  public render() {
    const {
      blocklistSize,
      blockedHits,
      massUnblock,
      undoMassUnblock
    } = this.props;
    return (
      blocklistSize > 0 && (
        <Card>
          <Card.Section>
            <Stack vertical={false}>
              <Stack.Item fill>
                <Heading>Recently blocked HITs ({blocklistSize} total)</Heading>
              </Stack.Item>

              <Stack.Item>
                <Popover position={Position.BOTTOM_RIGHT} canEscapeKeyClose>
                  <Button plain disclosure>
                    Sweep
                  </Button>
                  <SweepMenu
                    kind="hit"
                    title={'Unblock HITs...'}
                    entries={blockedHits.entries}
                    onMenuClick={massUnblock}
                    onUndo={undoMassUnblock}
                  />
                </Popover>
              </Stack.Item>
            </Stack>
          </Card.Section>
          <ResourceList
            items={blockedHits.recent.toArray()}
            renderItem={({ groupId }: BlockedHit) => (
              <BlockedHitCard key={groupId} blockedHitId={groupId} />
            )}
          />
        </Card>
      )
    );
  }
}

const mapState = (state: RootState): Props => ({
  blockedHits: {
    recent: recentlyBlockedHits(state),
    entries: {
      inThePast: {
        hour: blockedHitsInLast(1, Duration.HOURS)(state),
        day: blockedHitsInLast(1, Duration.DAYS)(state),
        week: blockedHitsInLast(1, Duration.WEEKS)(state)
      },
      olderThan: {
        thirtyDays: blockedHitsOlderThan(30, Duration.DAYS)(state),
        sixtyDays: blockedHitsOlderThan(60, Duration.DAYS)(state),
        ninetyDays: blockedHitsOlderThan(90, Duration.DAYS)(state)
      }
    }
  },
  blocklistSize: state.hitBlocklist.size
});

const mapDispatch = (dispatch: Dispatch<UnblockHit>): Handlers => ({
  massUnblock: (ids: Set<string>) => dispatch(unblockMultipleHits(ids)),
  undoMassUnblock: (hits: Set<BlockedHit>) => dispatch(blockMultipleHits(hits))
});

export default connect(mapState, mapDispatch)(HitBlockList);

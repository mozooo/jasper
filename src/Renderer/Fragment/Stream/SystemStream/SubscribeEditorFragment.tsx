import React from 'react';
import {Modal} from '../../../Library/View/Modal';
import {TextInput} from '../../../Library/View/TextInput';
import {Text} from '../../../Library/View/Text';
import styled from 'styled-components';
import {View} from '../../../Library/View/View';
import {Button} from '../../../Library/View/Button';
import {space} from '../../../Library/Style/layout';
import {GitHubUtil} from '../../../Library/Util/GitHubUtil';
import {SubscriptionIssuesRepo} from '../../../Repository/SubscriptionIssuesRepo';
import {UserPrefRepo} from '../../../Repository/UserPrefRepo';

type Props = {
  show: boolean;
  onClose: (newSubscribe: boolean) => void;
}

type State = {
  issueURL: string;
}

export class SubscribeEditorFragment extends React.Component<Props, State> {
  state: State = {
    issueURL: '',
  }

  private async handleOK() {
    const url = this.state.issueURL;
    if (!GitHubUtil.isIssueUrl(UserPrefRepo.getPref().github.webHost, url)) return;

    const {error} = await SubscriptionIssuesRepo.subscribe(url);
    if (error) return console.error(error);

    this.setState({issueURL: ''});
    this.props.onClose(true);
  }

  private handleCancel() {
    this.setState({issueURL: ''});
    this.props.onClose(false);
  }

  render() {
    return (
      <Modal show={this.props.show} onClose={() => this.props.onClose(false)} style={{width: 400}}>
        <Text>Please enter issue URL you want subscribe to.</Text>
        <TextInput
          value={this.state.issueURL}
          onChange={t => this.setState({issueURL: t})}
          placeholder='https://github.com/foo/bar/issues/1'
          autoFocus={true}
          onEnter={() => this.handleOK()}
        />
        <Buttons>
          <Button onClick={() => this.handleCancel()}>Cancel</Button>
          <Button onClick={() => this.handleOK()} style={{marginLeft: space.medium}} type='primary'>OK</Button>
        </Buttons>
      </Modal>
    );
  }
}

const Buttons = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-top: ${space.medium}px;
`;


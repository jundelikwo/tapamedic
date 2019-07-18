import React from 'react';
import { connect } from 'react-redux'
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

import { OPENTOK_API_KEY } from '../../../config';
import { initiateWebRTC } from '../../../actions';

class WebRTC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      connection: 'Connecting',
      publishVideo: false,
    };

    this.sessionEventHandlers = {
      connectionDestroyed: () => {
        console.log('connectionDestroyed')
        this.props.dispatch(initiateWebRTC(null, this.props.consultationId))
      },
      sessionConnected: () => {
        console.log('sessionConnected')
        this.setState({ connection: 'Connected' });
      },
      sessionDisconnected: () => {
        console.log('sessionDisconnected')
        this.setState({ connection: 'Disconnected' });
        this.props.dispatch(initiateWebRTC(null, this.props.consultationId))
      },
      sessionReconnected: () => {
        console.log('sessionReConnected')
        this.setState({ connection: 'Reconnected' });
      },
      sessionReconnecting: () => {
        console.log('sessionReconnecting')
        this.setState({ connection: 'Reconnecting' });
      },
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log('User denied access to media source');
        alert('You request could not be processed because you denied access to your media source')
        this.props.dispatch(initiateWebRTC(null, this.props.consultationId))
      },
      streamCreated: () => {
        console.log('Publisher stream created');
      },
      streamDestroyed: ({ reason }) => {
        console.log(`Publisher stream destroyed because: ${reason}`);
        this.props.dispatch(initiateWebRTC(null, this.props.consultationId))
      },
    };

    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log('Subscriber video enabled');
      },
      videoDisabled: () => {
        console.log('Subscriber video disabled');
      },
    };
  }

  onSessionError = error => {
    console.log('onSessionError',error)
    this.setState({ error });
  };

  onPublish = () => {
    console.log('Publish Success');
  };

  onPublishError = error => {
    this.setState({ error });
  };

  onSubscribe = () => {
    console.log('Subscribe Success');
  };

  onSubscribeError = error => {
    console.log('onSubscribeError', error)
    this.setState({ error });
  };

  render() {
    const { consultationId, session, token, publishVideo, photo } = this.props;
    const { error, connection } = this.state;
    let wrapperClassName = "webrtc-wrapper"
    wrapperClassName += publishVideo ? '' : ' webrtc-audio'
    return (
      <div className={wrapperClassName}>
        <div id="sessionStatus">Session Status: {connection}</div>
        {error ? (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        ) : null}
        <OTSession
          apiKey={OPENTOK_API_KEY}
          sessionId={session}
          token={token}
          onError={this.onSessionError}
          eventHandlers={this.sessionEventHandlers}
        >
          <OTPublisher
            properties={{ publishVideo }}
            onPublish={this.onPublish}
            onError={this.onPublishError}
            eventHandlers={this.publisherEventHandlers}
          />
          <div className="subscriberProfilePhoto">
            <img src={photo}/>
          </div>
          <div className="close-btn">
            <button onClick={() => this.props.dispatch(initiateWebRTC(null, consultationId))} className="btn btn-danger"><i className="fa fa-tty"/></button>
          </div>
          <OTStreams>
            <OTSubscriber
              onSubscribe={this.onSubscribe}
              onError={this.onSubscribeError}
              eventHandlers={this.subscriberEventHandlers}
            />
          </OTStreams>
        </OTSession>
      </div>
    );
  }
}

export default connect(null)(WebRTC)
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import _util_ from './u';

class Riverine extends React.component {
  constructor() {
    super();
    this.scrubberClicked = false;
    this.duration        = '';
    this.audioNode       = '';
    this.playButton      = '';
    this.playHead        = '';
    this.timeline        = '';
    this.timelineWidth   = '';
    this.sourceDuration  = '';

    this.addHover        = this.addHover.bind(this);
    this.handleHover     = this.handleHover.bind(this);
    this.handlePlayhead  = this.handlePlayhead.bind(this);
    this.handleResize    = this.handleResize.bind(this);
    this.mouseDown       = this.mouseDown.bind(this);
    this.play            = this.play.bind(this);
    this.removeHover     = this.removeHover.bind(this);
    this.returnDuration  = this.returnDuration.bind(this);
    this.updateTime      = this.updateTime.bind(this);
  }

  componentDidMount() {
    const that         = ReactDOM.findDOMNode(this);
    this.audioNode     = that.children[0];
    this.duration      = that.children[1].children[1].children[2];
    this.hover         = that.children[1].children[1].children[0];
    this.playButton    = that.children[1].children[0];
    this.playHead      = that.children[1].children[1].children[1];
    this.timeline      = that.children[1].children[1];
    this.timelineWidth = this.timeline.offsetWidth - this.playHead.offsetWidth;

    this.audioNode.addEventListener('timeupdate', this.handlePlayhead.bind(this));
    this.timeline.addEventListener('mouseover', this.handleHover.bind(this));
    window.addEventListener('mouseup', this.mouseUp.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  addHover(e) {
    let positionOffset = _u.handleOffsetParent(this.timeline);
    let newMargLeft = e.pageX - positionOffset;

    if (newMargLeft >= 0 && newMargLeft <= this.timelineWidth) {
      this.hover.style.width = newMargLeft + 'px';
    };

    if (newMargLeft < 0) {
      this.hover.style.width = '0px';
    };

    if (newMargLeft > this.timelineWidth) {
      this.hover.style.width = this.timelineWidth + 'px';
    };
  }

  clickPercent(e) {
    let positionOffset = _u.handleOffsetParent(this.timeline);
    return (e.pageX - positionOffset) / this.timelineWidth;
  }

  returnDuration() {
    this.sourceDuration = this.audioNode.duration;
    this.duration.innerHTML = _u.handleTime(this.audioNode.duration);
    this.updateTime();
  }

  play() {
    if (this.audioNode.paused) {
      this.audioNode.play();
      this.playButton.children[0].classList = '';
      this.playButton.children[0].classList = 'fa fa-pause';
    } else {
      this.audioNode.pause();
      this.playButton.children[0].classList = '';
      this.playButton.children[0].classList = 'fa fa-play';
    };
  }

  updateTime() {
    this.duration.innerHTML = _u.handleTime(this.audioNode.currentTime) + ' / ' + _u.handleTime(this.audioNode.duration);

    if (this.audioNode.currentTime === this.sourceDuration) {
      this.playButton.children[0].classList = '';
      this.playButton.children[0].classList = 'fa fa-play';
    };
  }

  handleHover() {
    if (this.props.hover) {
      this.timeline.addEventListener('mousemove', this.addHover, false);
      this.timeline.addEventListener('mouseout', this.removeHover, false);
    };
  }

  handlePlayhead() {
    let playPercent = this.timelineWidth * (this.audioNode.currentTime / this.audioNode.duration);

    if (this.props.margin) {
      this.playhead.style.marginLeft = playPercent + 'px';
    } else {
      this.playhead.style.paddingLeft = playPercent + 'px';
    };
  }

  handleResize() {
    let padding = this.playhead.style.paddingLeft;
    let p;

    padding === '' ? p = 0 : p = parseInt(padding.substring(0, padding.length - 2));
    this.timelineWidth = (this.timeline.offsetWidth - this.playhead.offsetWidth) + p;
    this.handlePlayhead();
  }

  mouseDown() {
    this.scrubberClicked = true;
    window.addEventListener('mousemove', this.movePlayhead.bind(this));
    this.audioNode.removeEventListener('timeupdate', this.handlePlayhead, false);
  }

  mouseUp(e) {
    if (this.scrubberClicked === false) {
      return;
    };

    this.movePlayhead(e);
    window.removeEventListener('mousemove', this.movePlayhead.bind(this));
    this.audioNode.currentTime = this.audioNode.duration * this.clickPercent(e);
    this.audioNode.addEventListener('timeupdate', this.handlePlayhead, false);
    this.scrubberClicked = false;
  }

  movePlayhead(e) {
    let positionOffset = _u.handleOffsetParent(this.timeline);
    let newMargLeft = e.pageX - positionOffset;
    let n = this.playhead.style.width;

    if (newMargLeft >= 0 && newMargLeft <= this.timelineWidth) {
      n = newMargLeft + 'px';
    };

    if (newMargLeft < 0) {
      n = '0px';
    };

    if (newMargLeft > this.timelineWidth) {
      n = this.timelineWidth + 'px';
    };
  }

  removeHover() {
    this.hover.style.width = '0px';
  }

  render : function() {
    return (
      <section>
        <audio id={_util_.newId(this.props.playerId)} preload="true" onDurationChange={this.returnDuration} onTimeUpdate={this.updateTime} loop={this.props.loop}>
          <source src={this.props.source}/>
        </audio>
        <div className={this.props.playerClass}>
          <button className={this.props.playClass} onClick={this.play}></button>
          <div className={this.props.timelineClass} onMouseDown={this.mouseDown}>
            <div className={this.props.hoverClass}></div>
            <div className={this.props.playheadClass} onMouseDown={this.mouseDown}></div>
            <div className={this.props.durationClass}>
              <span></span>
            </div>
            <div className={this.props.titleClass}>
              <span>{this.props.title}</span>
            </div>
          </div>
        </div>
      </section>
    )
  }
};

Riverine.defaultProps = {
  durationClass : 'riverine-duration',
  hover         : false,
  hoverClass    : 'riverine-hover',
  loop          : false,
  margin        : false,
  playClass     : 'riverine-play-button',
  playheadClass : 'riverine-playhead',
  playerClass   : 'riverine-player',
  playerId      : 'riverine-',
  pauseClass    : 'riverine-pause-button',
  timelineClass : 'riverine-timeline',
  titleClass    : 'riverine-title'
};

Riverine.propTypes = {
  durationClass : React.PropTypes.string,
  hover         : React.PropTypes.bool,
  hoverClass    : React.PropTypes.string,
  loop          : React.PropTypes.bool,
  margin        : React.PropTypes.bool,
  playClass     : React.PropTypes.string,
  playheadClass : React.PropTypes.string,
  playerClass   : React.PropTypes.string,
  playerId      : React.PropTypes.string,
  pauseClass    : React.PropTypes.string,
  source        : React.PropTypes.string.isRequired,
  timelineClass : React.PropTypes.string,
  title         : React.PropTypes.string,
  titleClass    : React.PropTypes.string
};

export default Riverine;

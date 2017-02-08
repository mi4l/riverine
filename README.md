# Riverine

A simple, lightweight wrapper for the HTML media element, specifically targeting audio functionality.  There is no styling included in this wrapper.  (Check out Riverine's docs here.)[http://riverine.surge.sh/]

    npm i riverine --save

Supply a source file, a margin boolean, a hover boolean, a loop boolean, and CSS class names for each nested element.  If no class names or ID's are given, default classes/ID's are created.  The margin property is used to determine whether or not the playhead moves via margin change or via padding change.  If the margin is marked as false, it'll move by increasing padding.  Its default value is true.  Hover is used to add an option for mouseover progress selection.  This is set to true in the demo.

Other available properties: playerId, playerClass, timelineClass, playheadClass, & durationClass.

#### Sample usage:

```
import './css/main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Riverine from 'riverine';

const Root = () => (
  <Riverine
    source="audio/1.wav"
  />
);

ReactDOM.render(<Root/>, document.querySelector('#root'));
```

Feel free to create an issue, or message me at [@mskalandunas](https://twitter.com/mskalandunas) if you have any questions.

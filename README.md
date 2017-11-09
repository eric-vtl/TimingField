TimingField
=================

A jquery plugin to transform a input field into (+/-) hours/minutes/seconds selector.  
Field value output as (+/-)SECONDS or (+/-)HH:MM:SS.

Requirements
------------

 * jQuery
 * Twitter Bootstrap
 
Sample
------
![TimingField sample image](docs/timingfield.png)

With useTimestamp: true - value output in seconds
  *<input value="+86400" ... >
  
With useTimestamp: false - value output in HH:MM:SS
  *<input value="+24:00:00" ... >

Configuration
-------------

This is the current available configuration :

```javascript
$.fn.timingfield.defaults = {
    maxHour: 23,
    minutesInterval: 5,
    width: '100%',
    signText: '+/-',
    daysText: 'D',
    hoursText: 'H',
    minutesText: 'M',
    secondsText: 'S',
    useTimestamp: true,
    signVisible: true,
    daysVisible: true,
    hoursVisible: true,
    minutesVisible: true,
    secondsVisible: true,
    defaultValue: 300
};
```

Usage
-----

```javascript
...
$('.timestamp').timingfield();
...
```

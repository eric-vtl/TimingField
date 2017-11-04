TimingField
=================

A jquery plugin to transform a timestamp field into an hours/minutes/seconds selector.

Requirements
------------

 * jQuery
 * Twitter Bootstrap

Configuration
-------------

This is the current available configuration :

```javascript
$.fn.timingfield.defaults = {
    maxHour: 23,
    minutesInterval: 5,
    width: '100%',
    daysText: 'D',
    hoursText: 'H',
    minutesText: 'M',
    secondsText: 'S',
    useTimestamp: false,
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

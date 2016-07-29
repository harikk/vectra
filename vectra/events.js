var Events = {
    createEvent: function (name) {
        var event;
        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(name, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = name;
        }
        event.eventName = name;
        return event;
    },
    fireEvent: function (event, element) { 
        if (!element){ 
            element = window;
        }
        if (document.createEvent) {
            element.dispatchEvent(event);
        } else {
            element.fireEvent("on" + event.eventType, event);
        }
    }
};
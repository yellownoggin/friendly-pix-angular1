namespace name {

    angular
        .module('app.shared')
        .filter('getTimeText', getTimeText);


        /* Given the time of creation of a post
        * returns how long since the creation of the post in text
        * format. e.g. 5d, 10h, now...
        */
               function getTimeText() {

                   return (postCreationTimestamp) => {

                       let millis = Date.now() - postCreationTimestamp;
                       const ms = millis % 1000;
                       millis = (millis - ms) / 1000;
                       const secs = millis % 60;
                       millis = (millis - secs) / 60;
                       const mins = millis % 60;
                       millis = (millis - mins) / 60;
                       const hrs = millis % 24;
                       const days = (millis - hrs) / 24;
                       var timeSinceCreation = [days, hrs, mins, secs, ms];

                       let timeText = 'Now';
                       if (timeSinceCreation[0] !== 0) {
                           timeText = timeSinceCreation[0] + 'd';
                       } else if (timeSinceCreation[1] !== 0) {
                           timeText = timeSinceCreation[1] + 'h';
                       } else if (timeSinceCreation[2] !== 0) {
                           timeText = timeSinceCreation[2] + 'm';
                       }
                       return timeText;

                   };

               }

}

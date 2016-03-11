#!/bin/bash

download(){
    VERSION=$1
    FILE=$2

    # Download the file.
    wget -O "smile-$VERSION.xpi" "https://addons.instantbird.org/en-US/instantbird/downloads/file/$FILE/smile!-$VERSION-instantbird.xpi?confirmed"
}

# Download and extract a particular version of smile.
download_and_extract(){
    VERSION=$1
    FILE=$2

    # Clear everything out of the working directory.
    rm -r *

    # Download the file.
    download $VERSION $FILE
    # Unzip it.
    unzip "smile-$VERSION.xpi" -d .

    # Remove the zipped version.
    rm "smile-$VERSION.xpi"

    # Add everything.
    git add .
}

mic_commit(){
    DATE=$1
    MSG=$2
    git commit --author "Benedikt Pfeifer <benediktp@ymail.com>" --date "$DATE" -m "$MSG"
}

cd smile
download 0.1 494
download 0.2 495
download 0.3 511
download 1.0 512
download 1.1 562
download 1.2 632
download 1.3 686

exit 0

# Move to the proper directory.
rm -rf smile
mkdir smile
cd smile

# Initialize the git repo
git init

# Start downloading and extracting versions
download_and_extract 0.1 494
mic_commit "April 24, 2012" "Version 0.1"
git tag 0.1

download_and_extract 0.2 495
mic_commit "April 26, 2012" "Version 0.2

Updates:
* Panel contents are created when theme is changed instead of when showing the panel. This avoids seeing how the items are added.
* Icon is unclickable and greyed out when no emoticon theme is selected (a.k.a. 'disabled')."
git tag 0.2

download_and_extract 0.3 511
mic_commit "July 2, 2012" "Version 0.3

Fix: icons no longer resized if there are icons of different size in a row or column.
Fix: Smile!-icon in the statusbar no longer blurred on Windows."
git tag 0.3

download_and_extract 1.0 512
mic_commit "July 2, 2012" "Version 1.0

Change: the statusbar icon will be replaced with a smiling icon from the selected theme if possible.
Fix: improved look on older Windows themes (Luna, Classic)."
git tag 1.0

download_and_extract 1.1 562
mic_commit "November 16, 2012" "Version 1.1

Fixed minor positioning problem of the panel. The arrow of the panel is centered below the icon now."
git tag 1.1

download_and_extract 1.2 632
mic_commit "December 31, 2013" "Version 1.2

No user-visible changes were made for this release. The update only included necessary changes to work with Instantbird 1.5 and 1.6a1pre nightly builds."
git tag 1.2

download_and_extract 1.3 686
git commit --author "Patrick Cloke <clokep@gmail.com>" --date  "August 30, 2015" -m "Version 1.3

Updated to work with the 1.6a1pre nightlies."
git tag 1.3


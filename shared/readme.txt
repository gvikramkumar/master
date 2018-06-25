
with both front and back on typescript it remains to be proven if we can share files between the two. the
ui will copy the code and concat/minimize for the UI dist and node will have the same path to it in /dist
directory, so in theory, should work. Needs to be verified. Using it currently in ui. That would be the case
that would fall apart as the ui loses all pathing when it concats/minimizes the code.


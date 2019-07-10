######################################################################
# Script : remote_findfa_ui.ksh
# Purpose: Invoke FINDFA UI Script to call remote hosts script execution 
######################################################################
#!/bin/ksh
set -x

# $1 is approvalEmailReminder 
datefield="`date +%m-%d-%y`"."`date +%T`"

. /apps/informatica/scripts/TES/FINDFA/findfa_env.env


echo "Remote executing the shell to launch DFA UI job $1 Start time :`date +%m/%d/%Y/%T`" > $FINDFA_TESLOGDIR/run-job.sh.log.$datefield

echo "$REMOTE_UI_URL_PREFIX/api/run-job/$1" >> $FINDFA_TESLOGDIR/run-job.sh.log.$datefield 

ssh -t $REMOTE_DPUSER@$REMOTE_DPHOST sh $REMOTE_UI_DIR/run-job.sh $REMOTE_GENERIC_PWD $REMOTE_UI_URL_PREFIX/api/run-job/$1

status=$?


if [ $status -ne 0 ]; then
echo "FAILURE: Execution of script run-job.sh $1 on <$REMOTE_DPHOST> for DFA UI application has failed." >> $FINDFA_TESLOGDIR/run-job.sh.log.$datefield
exit 1
else 
echo "SUCCESS: Execution of script run-job.sh $1 on <$REMOTE_DPHOST> for DFA UI application has completed successfully." >> $FINDFA_TESLOGDIR/run-job.sh.log.$datefield
exit 0
fi

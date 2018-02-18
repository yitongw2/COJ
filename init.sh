echo starting redis service
sudo service redis_6379 start 
echo starting flask service for executor
python3 ./executor/executor_server.py &
cd oj-client
echo building oj-client at $PWD
ng build --watch &
echo starting oj-sever at $PWD
cd ../oj-server 
npm start

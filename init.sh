echo starting redis service
sudo service redis_6379 start 
echo starting nginx service
sudo service nginx start
echo building oj-client at $PWD
cd oj-client
ng build
echo starting flask service for executor
cd ../executor
sudo python3 executor_server.py &
echo starting oj-sever at $PWD
cd ../oj-server 
npm start

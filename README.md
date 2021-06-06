# Codeway Log Analytics Infrastructure

This challenge asked participants to build a log analytics infrastrucute, specically to be used with Google Big Query service.

Another requirement stated that this design should be able to scale with high throughput.

It was described that we need to implement at least two services, one for post requests to register new logs, and another to serve analytics info.

## Assumptions ##

I assumed that scaling is needed on the data upload side of things (posting new log messages) since log messages are far more frequent than analytics queries (generally).

## Design ##
Big query is our main service provider for the case, and we need to scale our system around that.

Big query has hard request limits per second. Hence, to be able to provide stable log registering service against the uneven/varying log upload traffic, we need to provide some kind of buffer between our insert queries and the log upload traffic.

For that need, I used GC PubSub mechanism. I recieved the log requests on logProducer service and push them to the queue to be processed by logConsumer service.

After implementing this (later I have noticed the tip on PDF), I noticed that this can be done with DataFlow service of gcp (PubSub to BigQuery) but well, I was a little late for that.

And ofcourse finally, analytics service provides endpoints to query log data based on requested information on the pdf

To sum up there are three services implemented:
- logProducer service recieve new logs on POST /v1/logs/create endpoint and writes them to a PubSub topic (this can be scaled as needed)
- logConsumer service reads from this topic and inserts these log messages to big query (this is the heavy operation on the system/bottleneck)
- analytics service serves endpoints to provide analytics information

## Build && Run ##

Note: Please use provided .env file on the repo. I know it is bad practice but I couldn't make it on time.

As can be seen from the package.json, services can be build as 

In the order of logProducer, logConsumer, analytics:

```yarn start:producer```


```yarn start:consumer```


```yarn start:analytics```

Additionally there is a test script that uploads all of the example logs to the logProducer. To use it

```yarn start:sampleTest```

## Test ##
This project did not have any "bussiness logic" to validate, so I implemented unit tests to validate some async logic. You can use mocha to run them.

## Deploy ##

I did not deploy this solution to public cloud provider because I simply could not make it on time. I would like to deploy these to gcp app engine as node js projects.


## How to maintain multiple environments for this service? ##
Sadly I did not understant what is meant by environments. I should have clarifed it. If you want to discuss further please contact me.

## This service will be a part of a bigger set of services... ##
Well I believe this is an open ended question and I have some concerns if this services scales too much, but before mentioning that I want to explain what may be needen in microservice environment.

I think we need a service discovery to be able to introduce our services to the outer system. We will need some kind of configuration management system(i have only used etcd) for storing and sharing information such as big query table id, log sink name and many more. We would need to design scaling policies for each service and also monitoring systems to keep track of the health of the log flow.

But with a really high throughput, I do not think it is logical to desing our system around big query. If we somewhat already know what we want to extract from logs, we can design an event driven system if our requirements are suitable. This would we way more cost efficient and scalable than inserting that many records frequently to big query.

## Todo

- Deploy to a public cloud provider
- Do not leave any hardcoded configuration
- Design a better structure for adding new queries with minimal change
- Queries reside on a controller file in a very ugly manner, fix it
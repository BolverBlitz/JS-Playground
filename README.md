# Converting_Benchmark
#### Type: Pure JS
Benchmark to show you the difference performance of:
- Switch Case,
- indexOf,
- Key of Objects

Goal is to convert a string into a given number. I could think of those 3 ways and i used all 3 in the past but now i wanted to know the fastest.  
well its not that easy, depends on the iterations and the amount of strings you have or wanna process.  
Objects are winning in every test case.  
The switch case looses at first but gets second place after some time.

# n3+1_Cache_Benchmark
#### Type: NPM Modules needed
You can modify some config parameters. Either you can see how well the cache is working or you can compare Array.PUSH and Array.JOIN against \`${}` strings or "string" + "string".  
The cache stops the calculation as soon as it finds a already calculated number chain.  
You can also just run the fastest version and log everything to a file in case you wanna make some graphs :D
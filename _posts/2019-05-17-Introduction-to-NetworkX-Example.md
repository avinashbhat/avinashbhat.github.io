This is a post containing examples to add on to the previous post.



##### Modeling road network of India

_Import the necessary packages_


```python
import networkx as nx
import matplotlib.pyplot as plt
import random
```

_Create a graph object_


```python
G = nx.Graph()
```


```python
city_list = ['Jaipur', 'Surat', 'Pune', 'Ahmedabad', 'Hyderabad', 
             'Bangalore', 'Chennai', 'Kolkata', 'New Delhi', 'Mumbai']
```

_Create the nodes for each city in the graph_


```python
for each_city in city_list:
    G.add_node(each_city)
```


```python
nx.draw(G, with_labels=1)
plt.show()
```


![png](/images/2019-05-17-01.png)


_Create a cost array to assign the costs to the edge_


```python
costs = list()
value = 100
# Assign total of 20 values
while(value <= 2000):
    costs.append(value)
    value += 100
```

_Since there are 10 cities, add 20 edges to the graph in random_


```python
while(G.number_of_edges() <= 20):
    # Choose one city at random from the set of cities
    first_city = random.choice(list(G.nodes()))
    # Choose second city
    second_city = random.choice(list(G.nodes()))
    # If the two cities are equal then discard
    # If an edge already exists then discard
    if first_city != second_city and not G.has_edge(first_city, second_city):
        G.add_edge(first_city, second_city, weight = random.choice(costs))
```


```python
nx.draw(G, with_labels = 1)
pos = nx.circular_layout(G)
nx.draw_networkx_edge_labels(G, pos)
plt.show()
```


![png](/images/2019-05-17-02.png)


_Check if the graph is connected_


```python
print(nx.is_connected(G))
```

    True


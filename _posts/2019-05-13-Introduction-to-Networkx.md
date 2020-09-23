---
layout: post
title: Introduction to NetworkX
description: Introduction to NetworkX
summary: Introduction to NetworkX
date: 2019-05-13
category: blog
comments: true
tags: [code, networkx, network-analysis]
---
## What is NetworkX?
Wikipedia says NetworkX is a Python library for studying graphs and networks.

### General usage

_Import the necessary packages_


```python
import networkx as nx
import matplotlib.pyplot as plt
```

_Create a graph object_


```python
G = nx.Graph()
```

_Generating the nodes_


```python
G.add_node(1)
G.add_node(2)
G.add_node(3)
G.add_node(4)
G.add_node(5)
G.add_node(6)
```

_Generating the edges_


```python
G.add_edge(1,2)
G.add_edge(1,3)
G.add_edge(2,3)
G.add_edge(4,5)
G.add_edge(5,6)
G.add_edge(3,5)
```

_Draw the graph using matplotlib_


```python
nx.draw(G, with_labels=1)
plt.show()
```


<!-- ![png](output_11_0.png) -->
![png](/assets/images/2019-05-13-01.png)


### Generating a complete graph

_Generating a complete graph of 6 vertices_


```python
Z = nx.complete_graph(6)
```


```python
print(Z.edges)
```

    [(0, 1), (0, 2), (0, 3), (0, 4), (0, 5), (1, 2), (1, 3), (1, 4), (1, 5), (2, 3), (2, 4), (2, 5), (3, 4), (3, 5), (4, 5)]


_To get number of vertices and edges in the graph_


```python
print(Z.order())
print(Z.size())
```

    6
    15



```python
nx.draw(Z, with_labels=1)
plt.show()
```


<!-- ![png](output_18_0.png) -->
![png](/assets/images/2019-05-13-02.png)

### To generate a random graph

_Generating a graph of 10 vertices with probability of 0.5 of edge formation_


```python
R = nx.gnp_random_graph(10, 0.5)
```


```python
print(R.order())
print(R.size())
```

    10
    22



```python
nx.draw(R)
plt.show()
```


<!-- ![png](output_23_0.png) -->
![png](/assets/images/2019-05-13-03.png)


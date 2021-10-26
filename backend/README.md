# MR - Backend

The **backend** is a Spring Boot application implementing the logic for receiving an Apache Camel route as input, converting it into an internal object model, analyzing the obtained model, and determining the refactorings needed to resolve type mismatches in the imported architecture model.

## Object Model
The internal modelling of imported architectures is realized by means of four main Java classes:

* `NamedType`, which provides a representation for named types (both simple and composite) by means of four attributes, viz., the type name, the primitive XML type (if simple), the set of `NamedType`s contained in it (if composite), and a string that is used to distinguish simple types from composite types.
* `IntegrationNode`, which implements the representation of an integration node. It has an `id`, uniquely identifying the corresponding node, a `sort` attribute that indicates the type of node, and two lists of types, namely `INPUTS` and `OUTPUTS`, which contain the types of messages that the node receives and sends, respectively.
* `Channel`, which realizes the representation of channel, used by integration nodes to exchange messages. It contains four attributes: two IDs that identify the source and destination nodes for a channel, and two `NamedType`s, which respectively indicate the type of the message sent by the source node and that expected by the target node. Each channel is uniquely identified by the quadruple `$\langle$sourceID, sourceType, destID, destType$\rangle$`.
* `IntegrationArchitecture`, which contains two lists, one for the set of nodes in an integration architecture, and the other for the set of channels interconnecting such nodes. It ensures that each node in an architecture is provided with unique code identifying the node. This class also offers functions allowing to analyze the architecture and fixing the resolvable mismatches it contains.

## Route Parser
`RouteParser` implements the logic for parsing a string representing a CAMEL route and translating it into an `IntegrationArchitecture`. 
It contains a single attribute (the CAMEL route) and several public getters and setters, as well as the `parseRoute` method that allows to operate on the route to generate the architecture (based on the `javaparser` library).

## API
The `API` provides various POST and GET methods, which we describe hereafter. All POST methods requires parameters in JSON format, while all GET methods provides results in JSON format.

### POST methods
* `setRoute` (`HOST:8080/apiparser/route`) allows to load an existing architecture written in the Java DSL of Apache Camel.
* `setArchitecture` (`HOST:8080/apiintegration`) allows to create a new architecture from scratch and to set it as that to be considered by the current instance of the API. 
* `insertNode` (`HOST:8080/apiintegration/addNode`) allows to insert a new node in the architecture under consideration.
* `insertChannel` (`HOST:8080/apiintegration/addChannel`) allows to insert a new channel in the architecture under consideration.

The idea behind such POST methods is to enable loading the architecture to be considered twofold.
A first method is indeed to load an existing architecture with the `setRoute` method, providing it with an existing integration route written in the Java DSL of Apache Camel.
The other is to create an architecture from scratch, by first invoking `setArchitecture` to start the process, and by then adding nodes and channels through methods `insertNode` and `insertChannels`, respectively.

### GET methods
* `getCurrentRoute` (`HOST:8080/api/parser/route`) allows to retrieve the current route being analysed.
* `getNodes` (`HOST:8080/apiintegration/nodes`) allows to retrieve the nodes of the current architecture, if there are any.
* `getChannels` (`HOST:8080/apiintegration/channels`) allows to retrieve the channels of the current architecture, if there are any;
* `getIntegration` (`HOST:8080/apiparser/integration`) allows to retrieve the current integration architecture, if there is one;
* `getAnalyzedArchitecture` (`HOST:8080/apiintegration/analyzed`) allows to retrieve the architecture along with the list of mismatches present inside;
* `getFixedArchitecture` (`HOST:8080/apiintegration/fixed`) allows to begin the analysis and correction of current architecture and retrieve the architecture after it has been fixed where possible.

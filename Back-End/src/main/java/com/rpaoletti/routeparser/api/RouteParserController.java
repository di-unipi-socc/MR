package com.rpaoletti.routeparser.api;

import com.rpaoletti.routeparser.RouteParser;
import com.rpaoletti.routeparser.model.Channel;
import com.rpaoletti.routeparser.model.IntegrationArchitecture;
import com.rpaoletti.routeparser.model.IntegrationNode;
import com.rpaoletti.routeparser.service.RouteParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(path = "api")
public class RouteParserController {

    private final RouteParserService routeParserService;

    @Autowired
    public RouteParserController(RouteParserService routeParserService) {
        this.routeParserService = routeParserService;
        this.routeParserService.addRouteParser(new RouteParser(null));
    }

    @PostMapping(path = "parser/route")
    public void setRoute(@RequestBody RouteParser parser){
        System.out.println("POST REQUEST RECEIVED AT parser/route WITH BODY : " + parser);
        routeParserService.addRouteParser(parser);
        routeParserService.parseRoute();
    }

    @GetMapping(path = "parser/route")
    public String getCurrentRoute(){
        System.out.println("GET REQUEST RECEIVED AT parser/route");
        return routeParserService.getRoute();
    }

    @GetMapping(path = "integration/nodes")
    public List<IntegrationNode> getNodes()
    {
        System.out.println("GET REQUEST RECEIVED AT integration/nodes");
        return routeParserService.getNodes();
    }

    @GetMapping(path = "integration/channels")
    public List<Channel> getChannels() {
        System.out.println("GET REQUEST RECEIVED AT integration/channel");
        return routeParserService.getChannels();
    }

    @PostMapping(path = "integration/addNode")
    public void insertNode(@RequestBody IntegrationNode node){
        System.out.println("POST REQUEST RECEIVED AT integration/addNode WITH BODY : " + node);
        this.routeParserService.addNode(node);
    }

    @PostMapping(path = "integration/addChannel")
    public void insertChannel(@RequestBody Channel c){
        System.out.println("POST REQUEST RECEIVED AT integration/addChannel WITH BODY : " + c);
        this.routeParserService.addChannel(c);
    }

    @GetMapping(path = "parser/integration")
    public String getIntegration(){
        System.out.println("GET REQUEST RECEIVED AT parser/integration");
        return routeParserService.getIntegration();
    }

    @PostMapping(path = "integration")
    public void setArchitecture(@RequestBody IntegrationArchitecture architecture){
        System.out.println("POST REQUEST RECEIVED AT integration WITH BODY : " + architecture);
        this.routeParserService.setArchitecture(architecture);
    }

    @GetMapping(path = "integration/fixed")
    public IntegrationArchitecture getFixedArchitecture(){
        System.out.println("GET REQUEST RECEIVED AT integration/fixed");
        return this.routeParserService.getFixedArchitecture();
    }

    @GetMapping(path = "integration/analyzed")
    public IntegrationArchitecture getAnalyzedArchitecture(){
        System.out.println("GET REQUEST RECEIVED AT integration/analyzed");
        return this.routeParserService.getAnalyzedArchitecture();
    }
}

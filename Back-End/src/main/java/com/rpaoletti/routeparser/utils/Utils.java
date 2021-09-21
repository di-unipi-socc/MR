package com.rpaoletti.routeparser.utils;

import com.rpaoletti.routeparser.model.NamedType;

import java.util.*;

public class Utils {

    public static boolean isCastable(NamedType t1, NamedType t2){
        if(t1.isSimple() && t2.isSimple())
            if(t1.getXmltype().equals(t2.getXmltype())) return true;
            else return false;
        else
            return false;
    }

    public static boolean isSemanticallySimilar(NamedType t1, NamedType t2){
        if(t1.isSimple() && t2.isSimple())
            if(t1.getName().equals(t2.getName())) return true;
            else return false;
        else return false;
    }

    public static <T> List<T> union(List<T> list1, List<T> list2, int index) {
        List<T> newList = new ArrayList<>();

        for (int i = 0; i < index; i++) {
            if (list1.get(i) != null) newList.add(list1.get(i));
        }

        newList.addAll(list2);

        for (int i = index; i < list1.size(); i++){
            if (list1.get(i) != null) newList.add(list1.get(i));
        }

        return newList;
    }

    public static List<NamedType> leaves(NamedType t){
        List<NamedType> leaves = new ArrayList<>();
        for(NamedType u : t.getTypeset()){
            if(u.isSimple()) leaves.add(u);
            else leaves = union(leaves, leaves(u), 0);
        }
        return leaves;
    }

    public static List<NamedType> similarSet(NamedType t1, NamedType t2){
        List<NamedType> set = new ArrayList<>();
        if(t1.isSimple())
            if(t2.isSimple()){
                if(Utils.isSemanticallySimilar(t1, t2) && Utils.isCastable(t1, t2)){
                    set.add(t2);
                }
                return set;
            }else{
                for (NamedType t : t2.getTypeset()){
                    set = Utils.union(set, similarSet(t1, t), 0);
                }
            }
        return set;
    }

    public static Map<NamedType, List<NamedType>> similarSets(NamedType t1, NamedType t2){
        Map<NamedType, List<NamedType>> simSets = new HashMap<>();
        if(!t2.isSimple())
            if(t1.isSimple()){
                simSets.put(t1, similarSet(t1, t2));
            }else{
                for (NamedType t : t1.getTypeset()){
                    simSets.putAll(similarSets(t, t2));
                }
            }
        return simSets;
    }

    public static boolean isAdaptable(NamedType t1, NamedType t2){
        if(t2.isSimple()){
            if(!similarSet(t2, t1).isEmpty()) return true;
            else {
                return false;
            }
        }else{
            var simsets = similarSets(t2, t1);
            if (simsets.isEmpty()) return false;
            for (var e : simsets.entrySet()){
                if(e.getValue().isEmpty()) return false;
            }
            return true;
        }
    }

    public static boolean isCompatible(NamedType t1, NamedType t2) {
        if (t1.isSimple() && t2.isSimple()) {
            if (t1.getName().equals(t2.getName()) && t1.getXmltype().equals(t2.getXmltype()))
                return true;
            else return false;
        } else if ((t1.isSimple() && !t2.isSimple()) || (!t1.isSimple() && t2.isSimple())) {
            return false;
        } else {
            if (!t1.getName().equals(t2.getName())) return false;
            boolean found = false;
            for (NamedType t : t2.getTypeset()) {
                found = false;
                for (NamedType u : t1.getTypeset()) {
                    if (isCompatible(t, u)) {
                        found = true;
                        break;
                    }
                }
                if (!found) return false;
            }
            return true;
        }
    }

    public static final List<String> NodeCommands = List.of(
            "from",
            "to",
            "choice",
            "bean",
            "aggregate",
            "split",
            "process",
            "filter",
            "convertBodyTo",
            "enrich",
            "wireTap",
            "setHeader",
            "setProperty",
            "endChoice",
            "end",
            "when",
            "otherwise",
            "multicast",
            "recipientList",
            "translate",
            "wrap"
    );

    public static String matchCommand(String command){
        switch(command){
            case "from":
                return NODE_TYPE.ENTRYPOINT.toString();
            case "wireTap":
            case "to":
                return NODE_TYPE.ENDPOINT.toString();
            case "choice":
                return NODE_TYPE.ROUTER.toString();
            case "bean":
                return NODE_TYPE.COMPONENT.toString();
            case "aggregate":
                return NODE_TYPE.AGGREGATOR.toString();
            case "split":
                return NODE_TYPE.SPLITTER.toString();
            case "process":
                return NODE_TYPE.PROCESSOR.toString();
            case "filter":
                return NODE_TYPE.CONTENT_FILTER.toString();
            case "convertBodyTo":
            case "setHeader":
            case "setProperty":
            case "translate":
                return NODE_TYPE.TRANSLATOR.toString();
            case "enrich":
                return NODE_TYPE.CONTENT_ENRICHER.toString();
            case "multicast":
                return NODE_TYPE.MULTICAST.toString();
            case "recipientList":
                return NODE_TYPE.RECIPIENT_LIST.toString();
            case "wrap":
                return NODE_TYPE.TR_WRAPPER.toString();
            default:
                return null;
        }
    }
}


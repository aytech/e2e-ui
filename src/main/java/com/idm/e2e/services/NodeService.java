package com.idm.e2e.services;

import com.idm.e2e.entities.NodeEntity;
import com.idm.e2e.entities.NodeLogEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.models.BasicLog;
import com.idm.e2e.models.BasicNode;
import com.idm.e2e.repositories.NodeLogRepository;
import com.idm.e2e.repositories.NodeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NodeService {

    private final NodeRepository nodeRepository;
    private final NodeLogRepository nodeLogRepository;

    public NodeService(NodeRepository nodeRepository, NodeLogRepository nodeLogRepository) {
        this.nodeRepository = nodeRepository;
        this.nodeLogRepository = nodeLogRepository;
    }

    public List<BasicNode> getNodes(UserEntity userEntity) {
        return basicNodes(nodeRepository.findUserNodes(userEntity.getId()));
    }

    public BasicNode getNode(long nodeId) {
        Optional<NodeEntity> nodeEntity = nodeRepository.findById(nodeId);
        return nodeEntity.map(this::basicNode).orElseGet(BasicNode::new);
    }

    public boolean removeNode(NodeEntity nodeEntity) {
        nodeLogRepository.deleteByNodeId(nodeEntity.getId());
        nodeRepository.deleteById(nodeEntity.getId());
        return nodeRepository.findById(nodeEntity.getId()).isPresent();
    }

    private List<BasicNode> basicNodes(List<NodeEntity> nodeEntities) {
        List<BasicNode> basicNodes = new ArrayList<>();
        for (NodeEntity nodeEntity : nodeEntities) {
            basicNodes.add(basicNode(nodeEntity));
        }
        return basicNodes;
    }

    private BasicNode basicNode(NodeEntity nodeEntity) {
        BasicNode basicNode = new BasicNode();
        basicNode.setId(nodeEntity.getId());
        basicNode.setTag(nodeEntity.getNode());
        basicNode.setStatus(nodeEntity.getStatus());
        basicNode.setCreated(nodeEntity.getCreated());
        List<BasicLog> logs = new ArrayList<>();
        for (NodeLogEntity logEntity : nodeEntity.getLogs()) {
            BasicLog log = new BasicLog();
            log.setLevel(logEntity.getLevel());
            log.setLog(logEntity.getLog());
            log.setNodeId(logEntity.getNode().getId());
            log.setCategory(logEntity.getCategory());
            log.setCreated(logEntity.getCreated());
            logs.add(log);
        }
        basicNode.setLogs(logs);
        return basicNode;
    }
}

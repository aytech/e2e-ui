package com.idm.e2e.services;

import com.idm.e2e.entities.NodeEntity;
import com.idm.e2e.entities.NodeLogEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.models.BasicLog;
import com.idm.e2e.models.JobNode;
import com.idm.e2e.repositories.NodeLogRepository;
import com.idm.e2e.repositories.NodeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.idm.e2e.configuration.NodeStatues.COMPLETE;

@Service
public class NodeService {

    private final NodeRepository nodeRepository;
    private final NodeLogRepository nodeLogRepository;

    public NodeService(NodeRepository nodeRepository, NodeLogRepository nodeLogRepository) {
        this.nodeRepository = nodeRepository;
        this.nodeLogRepository = nodeLogRepository;
    }

    public List<JobNode> getNodes(UserEntity userEntity) {
        return basicNodes(nodeRepository.findUserNodes(userEntity.getId()));
    }

    public JobNode getNode(long nodeId) {
        Optional<NodeEntity> nodeEntity = nodeRepository.findById(nodeId);
        return nodeEntity.map(this::getJobNode).orElseGet(JobNode::new);
    }

    public NodeEntity getNodeEntity(long nodeId) {
        Optional<NodeEntity> nodeEntity = nodeRepository.findById(nodeId);
        return nodeEntity.orElse(null);
    }

    public boolean removeNode(NodeEntity nodeEntity) {
        nodeLogRepository.deleteByNodeId(nodeEntity.getId());
        nodeRepository.deleteById(nodeEntity.getId());
        return nodeRepository.findById(nodeEntity.getId()).isPresent();
    }

    public NodeEntity closeNode(NodeEntity nodeEntity) {
        nodeEntity.setStatus(COMPLETE);
        nodeRepository.save(nodeEntity);
        return nodeEntity;
    }

    private List<JobNode> basicNodes(List<NodeEntity> nodeEntities) {
        List<JobNode> basicNodes = new ArrayList<>();
        for (NodeEntity nodeEntity : nodeEntities) {
            basicNodes.add(getJobNode(nodeEntity));
        }
        return basicNodes;
    }

    public JobNode getJobNode(NodeEntity nodeEntity) {
        JobNode basicNode = new JobNode();
        basicNode.setId(nodeEntity.getId());
        basicNode.setTag(nodeEntity.getNode());
        basicNode.setStatus(nodeEntity.getStatus());
        basicNode.setCreated(nodeEntity.getCreated());
        List<BasicLog> logs = new ArrayList<>();
        for (NodeLogEntity logEntity : nodeEntity.getLogs()) {
            BasicLog log = new BasicLog();
            log.setId(logEntity.getId());
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

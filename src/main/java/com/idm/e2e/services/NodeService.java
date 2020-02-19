package com.idm.e2e.services;

import com.idm.e2e.entities.NodeEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.repositories.NodeRepository;
import com.idm.e2e.repositories.UserRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceContext;
import java.util.Optional;

@Service
public class NodeService {

    @PersistenceContext
    private EntityManager entityManager;
    private final NodeRepository nodeRepository;
    private final UserRepository userRepository;

    public NodeService(NodeRepository nodeRepository, UserRepository userRepository) {
        this.nodeRepository = nodeRepository;
        this.userRepository = userRepository;
    }

    public NodeEntity createNode(UserEntity user, NodeEntity nodeEntity) {
        Optional<UserEntity> userEntity = userRepository.findById(user.getId());
        if (userEntity.isPresent()) {
            userEntity.get().addNode(nodeEntity);
            entityManager.persist(nodeEntity);
//            return nodeRepository.save(nodeEntity);
        }
        return nodeEntity;
    }

    public NodeEntity updateNodeStatus(String status, NodeEntity nodeEntity) {
        Optional<NodeEntity> node = nodeRepository.findById(nodeEntity.getId());
        if (node.isPresent()) {
            node.get().setStatus(status);
            return nodeRepository.save(nodeEntity);
        }
        return nodeEntity;
    }
}

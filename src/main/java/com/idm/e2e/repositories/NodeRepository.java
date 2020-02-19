package com.idm.e2e.repositories;

import com.idm.e2e.entities.NodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NodeRepository extends JpaRepository<NodeEntity, Long> {
}

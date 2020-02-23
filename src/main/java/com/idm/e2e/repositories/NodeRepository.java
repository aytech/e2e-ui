package com.idm.e2e.repositories;

import com.idm.e2e.entities.NodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NodeRepository extends JpaRepository<NodeEntity, Long> {

    @Query("select Node from NodeEntity Node join Node.user User where User.id = :user_id")
    List<NodeEntity> findUserNodes(@Param("user_id") long userId);

    @Transactional
    @Modifying
    @Query("delete from NodeEntity Node where Node.id = :node_id")
    void deleteById(@Param("node_id") long nodeId);
}
